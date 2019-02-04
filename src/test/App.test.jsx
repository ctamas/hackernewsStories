import React from "react";
import { shallow, configure } from "enzyme";
import App from "../App";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("App", () => {
  describe("App render", () => {
    it("should render app and create card deck", () => {
      jest.spyOn(App.prototype, "getCardDeck");

      const wrapper = shallow(<App />);
      const text = wrapper.find(".card-deck-placeholder").text();
      expect(text).toEqual("");
      expect(App.prototype.getCardDeck).toHaveBeenCalled();
      wrapper.unmount();
    });
    it("should render loading spinner before loading is finished", () => {
      const wrapper = shallow(<App />);
      const text = wrapper.find(".loading-spinner").props().alt;
      expect(text).toBe("Loading");
      wrapper.unmount();
    });
  });
  describe("Search function", () => {
    it("should update saved query state property with new query term", () => {
      let newQuery = "abc";
      const wrapper = shallow(<App />);

      expect(wrapper.state("query")).toEqual("");

      wrapper.instance().handleSearch(newQuery);

      expect(wrapper.state("query")).not.toEqual("xyz");
      expect(wrapper.state("query")).toEqual("abc");
      wrapper.unmount();
    });
    it("should update state stories according to the filter", () => {
      let stories = [
        {
          id: 1,
          title: "google story"
        },
        {
          id: 1,
          title: "facebook story"
        },
        {
          id: 1,
          title: "twitter story"
        }
      ];
      let queryGoog = "google";
      let queryFace = "face";
      const wrapper = shallow(<App />);
      // In our app, filtered stories reside in "stories", and every loaded story in "allStories"
      wrapper.setState({ stories: stories, allStories: stories });

      // All 3 items visible at start
      expect(wrapper.state("stories").length).toEqual(3);
      expect(wrapper.state("allStories").length).toEqual(3);

      // Search for google news item
      wrapper.instance().handleSearch(queryGoog);

      expect(wrapper.state("query")).toEqual(queryGoog);
      expect(wrapper.state("stories")).toEqual([stories[0]]);
      expect(wrapper.state("stories").length).toEqual(1);
      expect(wrapper.state("allStories").length).toEqual(3);

      // Search for facebook news item
      wrapper.instance().handleSearch(queryFace);

      expect(wrapper.state("query")).toEqual(queryFace);
      expect(wrapper.state("stories")).toEqual([stories[1]]);
      expect(wrapper.state("stories").length).toEqual(1);
      expect(wrapper.state("allStories").length).toEqual(3);

      // Repeat previous search by not giving parameter
      wrapper.instance().handleSearch();

      expect(wrapper.state("query")).toEqual(queryFace);
      expect(wrapper.state("stories")).toEqual([stories[1]]);
      expect(wrapper.state("stories").length).toEqual(1);
      expect(wrapper.state("allStories").length).toEqual(3);

      // Clear searchbox
      wrapper.instance().handleSearch("");

      expect(wrapper.state("query")).toEqual("");
      expect(wrapper.state("stories")).toEqual(stories);
      expect(wrapper.state("stories").length).toEqual(3);
      expect(wrapper.state("allStories").length).toEqual(3);

      wrapper.unmount();
    });
  });
  describe("Loading news from API", () => {
    it("should load top 500 news array item from API", () => {
      const mockSuccessResponse = [133];
      const mockJsonPromise = Promise.resolve(mockSuccessResponse);
      const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise
      });
      jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);

      const wrapper = shallow(<App />);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/beststories.json"
      );
      jest.clearAllMocks();
      wrapper.unmount();
    });
  });
});
