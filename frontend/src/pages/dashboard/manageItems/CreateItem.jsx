/* eslint-disable react/prop-types */
import { useState } from "react";
import CustomModal from "../../../components/CustomModal";
import { Form, Input, message, Select } from "antd";
import { useCreateItemMutation } from "../../../redux/api/itemApi";

const CreateItem = ({ createModal, setCreateModal }) => {
  const [addItemInput, setAddItemInput] = useState("");
  const [selectCategory, setSelectCategory] = useState("");

  const [createItem] = useCreateItemMutation();

  const [form] = Form.useForm();

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

  return (
    <>
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
    </>
  );
};

export default CreateItem;
