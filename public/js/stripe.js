/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    "pk_test_51LrD7GSAWVr4MfVheqdavDMTFzDnLV343gw0znYHo5ZBtkt7DsIkumVVcOR2Lj0d362FSgUVblPIoRrrQ1gqvVll00tRkq6MnB"
  );
  try {
    const session = await axios({
      method: "GET",
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};
