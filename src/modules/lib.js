import axios from "axios";

export const handleLoadImg = async (file) => {
  const bodyFormData = new FormData();
  bodyFormData.append("image", file);
  try {
    const response = await axios({
      method: "post",
      url: `https://api.imgbb.com/1/upload?key=cd0adf282e243d02d379dacf9293556e`,
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.url;
  } catch (error) {
    console.log(error);
  }
};
export const formatPrice = (price, out) => {
  if (out) {
    return +price.replace(/[^a-zA-Z0-9 ]/g, "");
  } else {
    return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
};
