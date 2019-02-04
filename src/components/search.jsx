import React, { Component } from "react";

class Search extends Component {
  render() {
    return (
      <input
        autoFocus
        className="searchbox"
        placeholder=" Search for..."
        value={this.props.query}
        onChange={e => this.props.handleSearch(e.target.value)}
      />
    );
  }
}

export default Search;
