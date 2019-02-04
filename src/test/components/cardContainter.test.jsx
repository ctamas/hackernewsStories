import React from "react";
import { mount, configure } from "enzyme";
import CardContainer from "../../components/cardContainer";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("CardContainer", () => {
  let story = {
    id: 1,
    title: "test title",
    by: "test author",
    score: 100
  };

  describe("Test card data parsing", () => {
    it("should correctly parse SHORT story data", () => {
      const wrapper = mount(<CardContainer story={story} />);
      const text = wrapper.find(".card-text").text();

      expect(text).toEqual("test title");
      wrapper.unmount();
    });

    it("should correctly parse LONG story data, adding '...' and clipping end BEFORE expanding", () => {
      story.title = "long test title long test title long test title";

      const wrapper = mount(<CardContainer story={story} />);
      const text = wrapper.find(".card-text").text();

      expect(text).toEqual("long test title long test...");
      wrapper.unmount();
    });

    it("should correctly parse LONG story data AFTER expanding", () => {
      story.title = "long test title long test title long test title";

      const wrapper = mount(<CardContainer story={story} />);
      const card = wrapper.find(".card");
      card.simulate("click");
      const text = wrapper.find(".card-text").text();

      expect(text).toEqual("long test title long test title long test title");
      wrapper.unmount();
    });
  });

  describe("Check expanded class", () => {
    it("should NOT find expanded card class BEFORE clicked", () => {
      const wrapper = mount(<CardContainer story={story} />);
      const hasExpandedCard = wrapper.find(".card").hasClass("card-expanded");

      expect(hasExpandedCard).toEqual(false);
      wrapper.unmount();
    });

    it("should find expanded card class AFTER clicked", () => {
      const wrapper = mount(<CardContainer story={story} />);
      const card = wrapper.find(".card");
      card.simulate("click");
      const hasExpandedCard = wrapper.find(".card").hasClass("card-expanded");

      expect(hasExpandedCard).toEqual(true);
      wrapper.unmount();
    });

    it("should NOT find expanded card class AFTER clicked AGAIN", () => {
      const wrapper = mount(<CardContainer story={story} />);
      const card = wrapper.find(".card");
      card.simulate("click");
      card.simulate("click");
      const hasExpandedCard = wrapper.find(".card").hasClass("card-expanded");

      expect(hasExpandedCard).toEqual(false);
      wrapper.unmount();
    });
  });
});
