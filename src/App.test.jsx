import React from "react";
import { mount, configure } from "enzyme";
import App from "./App";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("App", () => {
  describe("App render", () => {
    it("should render app and create card deck", () => {
      const wrapper = mount(<App />);
      const text = wrapper.find("CardDeck").text();
      expect(text).toEqual("");
      wrapper.unmount();
    });
  });
  describe("Loading news from API", () => {
    it("should correctly detect API loading function was called, with jest mock", () => {
      const mockSuccessResponse = {};
      const mockJsonPromise = Promise.resolve(mockSuccessResponse);
      const mockFetchPromise = Promise.resolve({
        // 3
        json: () => mockJsonPromise
      });
      jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);

      const wrapper = mount(<App />); // 5

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/beststories.json"
      );
    });
  });
});
