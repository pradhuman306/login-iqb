let BASE_URL = "";
let URL = "";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "https://jdpatidar.com/iqb/api/";
  URL = "https://jdpatidar.com/iqb/api/";
} else {
  BASE_URL = "https://jdpatidar.com/iqb/api/";
  URL = "https://jdpatidar.com/iqb/api/";
}
const config = {
  BASE_URL,
  URL,
};

export default config;
