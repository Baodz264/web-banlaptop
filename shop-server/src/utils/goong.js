import axios from "axios";
import env from "../config/env.config.js";

class GoongService {

  static async geocode(address) {
    try {
      const res = await axios.get(
        "https://rsapi.goong.io/geocode",
        {
          params: {
            address,
            api_key: env.GOONG.API_KEY,  // <-- sửa ở đây
          },
        }
      );

      const result = res.data.results?.[0];

      if (!result) return null;

      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      };

    } catch (error) {
      console.error("Goong error:", error.message);
      return null;
    }
  }
}

export default GoongService;
