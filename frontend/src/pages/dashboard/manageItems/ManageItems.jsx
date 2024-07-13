import { useDebounced } from "../../../utils/debounce";
import { Button, Input, message, Select } from "antd";
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
  useDeleteItemMutation,
  useGetAllItemsQuery,
} from "../../../redux/api/itemApi";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import CreateItem from "./CreateItem";
import EditItem from "./EditItem";

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

  const [itemId, setItemId] = useState("");
  const [currentRecord, setCurrentRecord] = useState("");

  const [deleteItem] = useDeleteItemMutation();

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
      <CreateItem createModal={createModal} setCreateModal={setCreateModal} />

      {/* Edit Modal */}
      <EditItem
        setEditModal={setEditModal}
        editModal={editModal}
        currentRecord={currentRecord}
        itemId={itemId}
      />

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
