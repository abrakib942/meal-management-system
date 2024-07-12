import { useDebounced } from "../../../utils/debounce";
import { Button, Input, message, Select } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DataTable from "../../../components/DataTable";
import CustomModal from "../../../components/CustomModal";
import { useState } from "react";
import ActionBar from "../../../components/ActionBar";
import {
  useGetAllUserQuery,
  useUpdateUserMutation,
} from "../../../redux/api/userApi";
import exchange from "../../../assets/exchange.png";
import Loading from "../../../components/Loading";

const ManageUsers = () => {
  const query = {};

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [targetedId, setTargetedId] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [updateUser] = useUpdateUserMutation();

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;

  if (roleFilter) query["role"] = roleFilter;
  if (statusFilter) query["status"] = statusFilter;

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
  const { data, isLoading } = useGetAllUserQuery({ ...query });

  const usersData = data?.data.data;
  const meta = data?.data.meta;

  const handleUpdateStatus = (id, status) => {
    setTargetedId(id);
    setCurrentStatus(status);
    setEditModal(true);
  };

  const handleOkStatus = async () => {
    const newStatus = currentStatus === "active" ? "banned" : "active";

    const payloadObj = {
      status: newStatus,
    };

    try {
      const res = await updateUser({ userId: targetedId, data: payloadObj });
      console.log("res", res);
      if (res?.data) {
        message.success("User status updated");
        setEditModal(false);
      } else {
        message.error("Failed to update status, try again");
      }
    } catch (err) {
      console.error(err.message);
      message.error("An error occurred while updating status");
    }
  };

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "userId",
    // },
    {
      title: "Name",
      dataIndex: "name",
      render: (data) => <div className="">{data}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (data) => <div className="">{data}</div>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (data) => <div className="">{data}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (data) => (
        <div
          className={`${
            data === "banned" ? "bg-red-400" : "bg-green-300"
          } font-semibold rounded-2xl text-center`}
        >
          {data}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "userId",
      render: (userId, record) => {
        return (
          <>
            <img
              className="h-6 w-6 cursor-pointer"
              onClick={() => handleUpdateStatus(userId, record.status)}
              src={exchange}
              alt="Update Status"
            />
          </>
        );
      },
    },
    {
      title: "Registered_At",
      dataIndex: "createdAt",
      render: (data) => data && dayjs(data).format("MMM D, YYYY hh:mm A"),
      sorter: true,
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
    setRoleFilter("");
    setStatusFilter("");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ActionBar title={`User List (${meta?.total || 0})`}>
        <div className="flex items-center gap-20">
          <div>
            <div>Search</div>
            <Input
              type="text"
              size="large"
              placeholder="Search User Name, Email"
              style={{ width: "100%", marginBottom: 10 }}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="mb-1">Filter by Role</div>
            <Select
              showSearch
              style={{ width: "100%", marginBottom: 10 }}
              placeholder="Select a Role"
              onChange={(value) => setRoleFilter(value)}
              options={[
                {
                  value: "admin",
                  label: "admin",
                },
                {
                  value: "user",
                  label: "user",
                },
              ]}
            />
          </div>
          <div>
            <div className="mb-1">Filter by Status</div>
            <Select
              showSearch
              style={{ width: "100%", marginBottom: 10 }}
              placeholder="Select a Status"
              onChange={(value) => setStatusFilter(value)}
              options={[
                {
                  value: "active",
                  label: "active",
                },
                {
                  value: "banned",
                  label: "banned",
                },
              ]}
            />
          </div>
          <div>
            {(!!sortBy ||
              !!sortOrder ||
              !!searchTerm ||
              !!roleFilter ||
              statusFilter) && (
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
      </ActionBar>

      <DataTable
        loading={isLoading}
        columns={columns}
        dataSource={usersData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />

      <CustomModal
        title={`Update Status`}
        isOpen={editModal}
        closeModal={() => setEditModal(false)}
        handleOk={handleOkStatus}
      >
        <p className="my-5">
          Do you want to change the status to{" "}
          {currentStatus === "active" ? "banned" : "active"}?
        </p>
      </CustomModal>
    </div>
  );
};

export default ManageUsers;
