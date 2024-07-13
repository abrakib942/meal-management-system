/* eslint-disable react/prop-types */
import { Form, Input, message, Select } from "antd";
import CustomModal from "../../../components/CustomModal";
import { useState } from "react";
import { useUpdateItemMutation } from "../../../redux/api/itemApi";

const EditItem = ({ editModal, setEditModal, currentRecord, itemId }) => {
  const [editItemName, setEditItemName] = useState("");
  const [editItemCategory, setEditItemCategory] = useState("");

  const [updateItem] = useUpdateItemMutation();

  const [form] = Form.useForm();

  const handleEdit = async () => {
    try {
      await form.validateFields();

      const payloadObj = {
        name: editItemName || currentRecord?.name,
        category: editItemCategory || currentRecord?.category,
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
  return (
    <>
      <CustomModal
        title={`Edit Item`}
        isOpen={editModal}
        closeModal={() => {
          setEditModal(false);

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
    </>
  );
};

export default EditItem;
