import React, { Component } from "react";
import CardDeck from "react-bootstrap/CardDeck";
import Navbar from "react-bootstrap/Navbar";
import Fade from "react-bootstrap/Fade";

import Search from "./components/search";
import CardContainer from "./components/cardContainer";
import loadingSpinner from "./loading.png";
import newsLogo from "./logo.png";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      stories: [],
      allStories: [],
      query: ""
    };
    this.loadNews();
  }

  // Execute search, query is optional. Operation:
  // 1, Takes new query param from search component and updates saved query
  // 2, If no param is given search is repeated with previous query
  // This is useful to filter stories while they are still being loaded from API
  handleSearch = query => {
    query = query !== undefined ? query : this.state.query;
    let newStories = this.state.allStories.filter(story => {
      return story.title.toLowerCase().includes(query.toLowerCase())
        ? story
        : false;
    });
    this.setState({ stories: newStories, query: query });
  };

  // Load main news object.
  loadNews = () => {
    fetch("https://hacker-news.firebaseio.com/v0/beststories.json")
      .then(res => res.json())
      .then(
        newsList => {
          this.loadNewsStories(newsList);
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  // Load individual news stories and store in state
  loadNewsStories = newsList => {
    let newStories = [];
    let promises = newsList.map((storyId, index) => {
      return fetch(
        "https://hacker-news.firebaseio.com/v0/item/" + storyId + ".json"
      )
        .then(res => res.json())
        .then(
          story => {
            newStories = [...newStories, story];
            // Render only after a minimum number of stories are loaded for performance
            // Render when all values are loaded
            if (!(index % minStoriesLoaded) || index === newsList.length - 1) {
              this.setState(
                {
                  stories: newStories,
                  allStories: newStories
                },
                // Search runs on same update cycle if the searchbox is not empty
                // This lets searches to be executed before all stories have been loaded
                () => {
                  if (this.state.query) {
                    this.handleSearch();
                  }
                }
              );
            }
          },
          error => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    });
    // isLoaded parameter is used by the loading spinner.
    Promise.all(promises).then(() => {
      this.setState({ isLoaded: true });
    });
  };

  getCardDeck() {
    // Notice placeholder when search is done with no matches
    if (!this.state.stories.length && this.state.allStories.length) {
      return <h5 className="card-deck-placeholder">No matches found.</h5>;
    } else if (this.state.allStories.length > minStoriesLoaded) {
      // Create card deck when minimum of loaded stories are met
      let storyList = this.state.stories.map(story => {
        return <CardContainer key={story.id} story={story} />;
      });
      return <CardDeck>{storyList}</CardDeck>;
      // Placeholder before any results are loaded
    } else {
      return (
        <div className="card-deck-placeholder">
          <img
            className="loading-spinner rotate faded"
            alt="Loading"
            src={loadingSpinner}
          />
        </div>
      );
    }
  }

  render() {
    let cardDeck = this.getCardDeck();
    let error = this.state.error ? <h3>Error loading stories!</h3> : null;
    // Loading spinner will only show when a search is done while still loading.
    // It indicates that results might be partial.
    return (
      <React.Fragment>
        <Navbar bg="light">
          <Navbar.Brand className="navbar-title" href="#home">
            <img alt="" src={newsLogo} className="logo align-center" />
            Hackernews Stories
            <Fade
              className="search-loading-notice rotate"
              in={!this.state.isLoaded && this.state.query !== ""}
            >
              <img alt="Loading" src={loadingSpinner} />
            </Fade>
          </Navbar.Brand>
          <Search handleSearch={this.handleSearch} query={this.query} />
        </Navbar>
        {error}
        {cardDeck}
      </React.Fragment>
    );
  }
}
// Number of stories to be loaded before first render. 25 cards will fill the typical display.
const minStoriesLoaded = 25;
export default App;
