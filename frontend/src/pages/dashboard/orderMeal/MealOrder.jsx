import { Card, message } from "antd";
import { getUserInfo } from "../../../utils/authService";
import CustomButton from "../../../components/CustomButton";
import {
  useDeleteOrderMutation,
  useMakeOrderMutation,
} from "../../../redux/api/orderApi";
import { useGetAllMealsQuery } from "../../../redux/api/mealApi";
import { useState } from "react";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const MealOrder = () => {
  const [userOrder, setUserOrder] = useState({});
  const { data: mealsData } = useGetAllMealsQuery({});
  const [makeOrder] = useMakeOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const { userId } = getUserInfo();

  const handleOrder = async (mealId, day) => {
    try {
      const res = await makeOrder({ mealId, userId });
      if (res?.data) {
        message.success("Order successful");
        setUserOrder((prevOrder) => ({
          ...prevOrder,
          [day]: res?.data,
        }));
      }
      if (res?.error) {
        message.error(res?.error.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleNoMeal = async (day) => {
    try {
      const order = userOrder[day];
      if (order) {
        await deleteOrder({ orderId: order.id });
      }
      message.success(`No meal selected for ${day}`);
      setUserOrder((prevOrder) => ({
        ...prevOrder,
        [day]: "no meal",
      }));
    } catch (error) {
      console.error("Error selecting no meal:", error);
    }
  };

  return (
    <div>
      <h1>Weekly Meal Schedules</h1>
      <div className="flex gap-10">
        {weekdays.map((day, i) => {
          const dayMeals = mealsData?.data.filter(
            (meal) => meal.mealDay === day
          );
          const hasMeals = dayMeals && dayMeals.length > 0;
          const orderExists = userOrder[day] && userOrder[day] !== "no meal";

          return (
            <Card key={i}>
              <div className="text-[15px] font-bold text-center">{day}</div>
              <div>
                <p className="text-green-600 font-bold">Meal Items</p>
                <div>
                  {hasMeals ? (
                    dayMeals.map((meal) =>
                      meal.items.map((item) => (
                        <div key={item.itemId}>{item.item.name}</div>
                      ))
                    )
                  ) : (
                    <p>No meal items for this day</p>
                  )}
                </div>
              </div>
              <div className="my-5">
                {hasMeals ? (
                  orderExists ? (
                    <>
                      <CustomButton
                        className="bg-gray-600 "
                        onClick={() => handleNoMeal(day)}
                      >
                        Set No Meal Day
                      </CustomButton>
                    </>
                  ) : userOrder[day] === "no meal" ? (
                    <>
                      <p className="text-red-500">No meal selected</p>
                      <CustomButton
                        onClick={() => handleOrder(dayMeals[0].mealId, day)}
                      >
                        Place Order
                      </CustomButton>
                    </>
                  ) : (
                    <>
                      <CustomButton
                        onClick={() => handleOrder(dayMeals[0].mealId, day)}
                      >
                        Place Order
                      </CustomButton>
                      <CustomButton
                        className="bg-gray-600 mt-5"
                        onClick={() => handleNoMeal(day)}
                      >
                        No Meal
                      </CustomButton>
                    </>
                  )
                ) : (
                  <p className="text-red-500">
                    **ask your admin to create a meal
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MealOrder;
