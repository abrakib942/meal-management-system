import { useDebounced } from "../../../utils/debounce";
import { Button, Form, Input, message, Select } from "antd";
import {
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import DataTable from "../../../components/DataTable";

import { useState } from "react";
import ActionBar from "../../../components/ActionBar";
import {} from "../../../redux/api/userApi";

import Loading from "../../../components/Loading";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetAllItemsQuery,
  useUpdateItemMutation,
} from "../../../redux/api/itemApi";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";

const ManageItems = () => {
  const query = {};

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [createModal, setCreateModal] = useState("");
  const [editModal, setEditModal] = useState("");
  const [deleteModal, setDeleteModal] = useState("");
  const [addItemInput, setAddItemInput] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [editItemName, setEditItemName] = useState("");
  const [editItemCategory, setEditItemCategory] = useState("");
  const [itemId, setItemId] = useState("");
  const [currentRecord, setCurrentRecord] = useState("");

  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  const [form] = Form.useForm();

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;

  if (categoryFilter) query["category"] = categoryFilter;

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
  const { data, isLoading, refetch } = useGetAllItemsQuery({ ...query });

  if (isLoading) {
    return <Loading />;
  }

  const itemsData = data?.data.data;
  const meta = data?.data.meta;

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "itemId",
    // },
    {
      title: "Name",
      dataIndex: "name",
      render: (data) => <div className="">{data}</div>,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (data) => <div className="">{data}</div>,
    },

    {
      title: "Action",
      dataIndex: "itemId",
      render: (itemId, record) => {
        return (
          <>
            <Button
              onClick={() => {
                setEditModal(true);
                refetch();
                setCurrentRecord(record);

                setItemId(itemId);
              }}
              style={{
                margin: "0px 5px",
              }}
              type="primary"
            >
              <EditOutlined />
            </Button>
            <Button
              onClick={() => {
                setDeleteModal(true);
                setItemId(itemId);
              }}
              type="primary"
              danger
            >
              <DeleteOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  const onPaginationChange = (page, pageSize) => {
    setPage(page);
    setSize(pageSize);
  };

  const onTableChange = (pagination, filter, sorter) => {
    const { order, field } = sorter;
    setSortBy(field);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
    setCategoryFilter("");
  };

  const handleCreate = async () => {
    try {
      await form.validateFields();

      const payloadObj = {
        name: addItemInput,
        category: selectCategory,
      };

      const res = await createItem(payloadObj);

      if (res?.data) {
        message.success(res?.data.message);
        setCreateModal(false);
        form.resetFields();
      } else {
        message.error("Failed to create, try again");
      }
    } catch (error) {
      message.error("Please fill in all required fields");
    }
  };

  const handleEdit = async () => {
    try {
      await form.validateFields();

      const payloadObj = {
        name: editItemName,
        category: editItemCategory,
      };

      const res = await updateItem({ itemId, data: payloadObj });

      if (res?.data) {
        message.success(res?.data.message);
        setEditModal(false);
        form.resetFields();
        setEditItemName("");
        setEditItemCategory("");
      } else {
        message.error("Failed to update, try again");
      }
    } catch (error) {
      message.error("Please fill in all required fields");
    }
  };

  const handleDelete = async (itemId) => {
    message.loading("Deleting.....");
    console.log("res", itemId);
    try {
      const res = await deleteItem(itemId);
      if (res?.data) {
        message.success("Item Deleted");

        setDeleteModal(false);
      } else {
        message.error("Failed to Delete, try again");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <ActionBar title={`Item List (${meta?.total || 0})`}>
        <div className="flex items-center gap-20">
          <div>
            <div>Search</div>
            <Input
              type="text"
              size="large"
              placeholder="Search Item Name"
              style={{ width: "100%", marginBottom: 10 }}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="mb-1">Filter by Category</div>
            <Select
              showSearch
              style={{ width: "100%", marginBottom: 10 }}
              placeholder="Select a Category"
              onChange={(value) => setCategoryFilter(value)}
              options={[
                {
                  value: "Protein",
                  label: "Protein",
                },
                {
                  value: "Starch",
                  label: "Starch",
                },
                {
                  value: "Veg",
                  label: "Veg",
                },
                {
                  value: "none",
                  label: "none",
                },
              ]}
            />
          </div>

          <div>
            {(!!sortBy || !!sortOrder || !!searchTerm || !!categoryFilter) && (
              <Button
                onClick={resetFilters}
                type="primary"
                style={{ margin: "0px 5px" }}
              >
                <ReloadOutlined />
              </Button>
            )}
          </div>
        </div>
        <CustomButton onClick={() => setCreateModal(true)}>Create</CustomButton>
      </ActionBar>

      <DataTable
        loading={isLoading}
        columns={columns}
        dataSource={itemsData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
      {/* Create Item Modal */}
      <CustomModal
        title={`Create Item`}
        isOpen={createModal}
        closeModal={() => {
          setCreateModal(false);
          form.resetFields();
        }}
        handleOk={handleCreate}
      >
        <Form form={form}>
          <Form.Item
            label="Item Name"
            name="name"
            rules={[{ required: true, message: "Please enter Item Name" }]}
          >
            <Input
              type="text"
              size="large"
              onChange={(e) => setAddItemInput(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Select Category"
            name="category"
            rules={[{ required: true, message: "Please select a Category" }]}
          >
            <Select
              showSearch
              style={{ width: "100%", marginBottom: 10 }}
              placeholder="Select a Category"
              onChange={(value) => setSelectCategory(value)}
              options={[
                { value: "Protein", label: "Protein" },
                { value: "Starch", label: "Starch" },
                { value: "Veg", label: "Veg" },
                { value: "none", label: "none" },
              ]}
            />
          </Form.Item>
        </Form>
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal
        title={`Edit Item`}
        isOpen={editModal}
        closeModal={() => {
          setEditModal(false);
          refetch();
          form.resetFields();
        }}
        handleOk={() => handleEdit(itemId)}
      >
        <Form
          form={form}
          initialValues={{
            name: currentRecord?.name,
            category: currentRecord?.category,
          }}
        >
          <Form.Item
            label="Item Name"
            name="name"
            rules={[{ required: true, message: "Please enter Item Name" }]}
          >
            <Input
              type="text"
              size="large"
              onChange={(e) => setEditItemName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Select Category"
            name="category"
            rules={[{ required: true, message: "Please select a Category" }]}
          >
            <Select
              showSearch
              style={{ width: "100%", marginBottom: 10 }}
              placeholder="Select a Category"
              onChange={(value) => setEditItemCategory(value)}
              options={[
                { value: "Protein", label: "Protein" },
                { value: "Starch", label: "Starch" },
                { value: "Veg", label: "Veg" },
                { value: "none", label: "none" },
              ]}
            />
          </Form.Item>
        </Form>
      </CustomModal>

      {/* Delete Modal */}
      <CustomModal
        title={`Delete Item`}
        isOpen={deleteModal}
        closeModal={() => setDeleteModal(false)}
        handleOk={() => handleDelete(itemId)}
      >
        <p className="my-5">Do you want to Delete this Item? </p>
      </CustomModal>
    </div>
  );
};

export default ManageItems;
