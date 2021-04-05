import { selectors } from "../../modules/selectors";
import { useSelectors } from "./useSelectors";

export const useGapiClient = () => {
  const { clientLoaded } = useSelectors(selectors, "clientLoaded");

  if (clientLoaded) {
    gapi.client.setToken({
      access_token: localStorage.getItem("authToken")!,
    });

    return gapi.client;
  }
};
