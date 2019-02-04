import React from "react";
import { mount, configure } from "enzyme";
import Search from "../../components/search";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Search", () => {
  it("should read search query value from parent state", () => {
    let parentStateQuery = "abc";
    const wrapper = mount(<Search query={parentStateQuery} />);
    const searchbarText = wrapper.find("input").props().value;

    expect(searchbarText).toEqual("abc");
    wrapper.unmount();
  });
  it("should call parent class' handleSearch function with the correct parameter on query input", () => {
    const handleSearch = jest.fn();
    const wrapper = mount(<Search handleSearch={handleSearch} />);
    const searchbar = wrapper.find("input");
    searchbar.simulate("change", { target: { value: "abcdefg" } });

    expect(handleSearch).toBeCalledWith("abcdefg");
    wrapper.unmount();
  });
});
