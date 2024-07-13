import { useEffect, useState } from "react";
import { Button, Form, Popconfirm, Select, message } from "antd";
import { useGetAllItemsQuery } from "../../../redux/api/itemApi";
import {
  useCreateMealMutation,
  useDeleteMealMutation,
  useGetAllMealsQuery,
  useUpdateMealMutation,
} from "../../../redux/api/mealApi";
import Loading from "../../../components/Loading";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const ManageMeal = () => {
  const {
    data: itemsData,
    isLoading: isItemsLoading,
    refetch: refetchItems,
  } = useGetAllItemsQuery({});
  const {
    data,
    isLoading: isMealsLoading,
    refetch: refetchMeals,
  } = useGetAllMealsQuery({});
  const [createMeal] = useCreateMealMutation();
  const [updateMeal] = useUpdateMealMutation();
  const [deleteMeal] = useDeleteMealMutation();

  const [selectedItems, setSelectedItems] = useState({});
  const [editMode, setEditMode] = useState({});
  const [form] = Form.useForm();

  const mealsData = data?.data;

  useEffect(() => {
    form.resetFields();
    Object.keys(selectedItems).forEach((day) => {
      form.setFieldsValue({ [`items_${day}`]: selectedItems[day] });
    });
  }, [selectedItems, editMode, form]);

  const handleSelectChange = (day, value) => {
    setSelectedItems((prev) => ({
      ...prev,
      [day]: value,
    }));
    form.setFieldsValue({ [`items_${day}`]: value });
  };

  const handleCreateMeal = async (day) => {
    const mealItems = selectedItems[day];
    const riceItem = mealItems.find(
      (item) =>
        itemsData.data.data.find((dataItem) => dataItem.itemId === item)
          ?.category === "Starch"
    );
    if (!riceItem) {
      message.error("A meal must have a rice item.");
      return;
    }
    if (mealItems.length < 3) {
      message.error("A meal must have at least 3 items.");
      return;
    }
    const proteinCount = mealItems.filter(
      (item) =>
        itemsData.data.data.find((dataItem) => dataItem.itemId === item)
          ?.category === "Protein"
    ).length;
    if (proteinCount > 1) {
      message.error("A meal cannot have two protein sources.");
      return;
    }

    const res = await createMeal({ mealDay: day, items: mealItems });
    if (res.error) {
      message.error(res?.error.data.message);
    } else {
      message.success("Meal created successfully");

      window.location.reload();

      setSelectedItems((prev) => ({
        ...prev,
        [day]: [],
      }));
      refetchMeals();
      refetchItems();
    }
  };

  const handleUpdateMeal = async (mealId, day) => {
    const mealItems = selectedItems[day];
    const res = await updateMeal({
      mealId,
      data: { mealDay: day, items: mealItems },
    });

    if (res.error) {
      message.error(res?.error.data.message);
    } else {
      message.success("Meal updated successfully");
      setEditMode((prev) => ({
        ...prev,
        [day]: false,
      }));
      refetchMeals();
      refetchItems();
    }
  };

  const handleDeleteMeal = async (mealId) => {
    const res = await deleteMeal(mealId);
    if (res.error) {
      message.error(res?.error.data.message);
    } else {
      message.success("Meal deleted successfully");
      refetchMeals();
      refetchItems();
    }
  };

  const getMealForDay = (day) => {
    return mealsData?.find((meal) => meal.mealDay === day);
  };

  if (isItemsLoading || isMealsLoading) {
    return <Loading />;
  }

  return (
    <div>
      {weekdays.map((day) => (
        <div key={day} style={{ marginBottom: 20 }}>
          <h3>{day}</h3>
          {editMode[day] || getMealForDay(day) ? (
            <Form form={form}>
              <Form.Item
                name={`items_${day}`}
                initialValue={
                  getMealForDay(day)?.items.map((item) => item.itemId) || []
                }
              >
                <Select
                  mode="multiple"
                  placeholder="Select items for the meal"
                  onChange={(value) => handleSelectChange(day, value)}
                  options={itemsData?.data?.data.map((item) => ({
                    value: item.itemId,
                    label: item.name,
                  }))}
                />
              </Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  const existingMeal = getMealForDay(day);
                  if (existingMeal) {
                    handleUpdateMeal(existingMeal.mealId, day);
                  } else {
                    handleCreateMeal(day);
                  }
                }}
                style={{ marginRight: 10 }}
              >
                {getMealForDay(day) ? "Update Meal" : "Add Meal"}
              </Button>
              {getMealForDay(day) && (
                <Popconfirm
                  title="Are you sure to delete this meal?"
                  onConfirm={() =>
                    handleDeleteMeal(getMealForDay(day).mealId, day)
                  }
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger">Delete Meal</Button>
                </Popconfirm>
              )}
            </Form>
          ) : (
            <>
              <p>
                {getMealForDay(day)
                  ?.items.map((item) => item.name)
                  .join(", ")}
              </p>
              <Button
                type="default"
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, [day]: true }))
                }
              >
                Edit Meal
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageMeal;
