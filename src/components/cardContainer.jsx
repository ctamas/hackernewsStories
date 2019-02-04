import React, { Component } from "react";
import Card from "react-bootstrap/Card";

class ChartContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };

    this.handleExpand = this.handleExpand.bind(this);
  }

  handleExpand = event => {
    // Don't expand if title url is clicked
    if (!event.target.className.includes("card-title")) {
      this.setState({
        expanded: !this.state.expanded ? true : false
      });
    }
  };

  // Handle long and short story from when card is expanded or closed
  getStoryText(text) {
    if (this.state.expanded || this.props.story.title.length < maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength) + "...";
    }
  }

  render() {
    let expandedClass = this.state.expanded ? "card-expanded" : "";
    let storyText = this.getStoryText(this.props.story.title);
    return (
      <Card
        className={expandedClass}
        key={this.props.story.id}
        onClick={this.handleExpand}
      >
        <Card.Body>
          &#9650; {this.props.story.score}
          <a
            className="card-story-url"
            target="_blank"
            rel="noopener noreferrer"
            href={this.props.story.url}
          >
            <Card.Title>{this.props.story.title}</Card.Title>
          </a>
          <Card.Subtitle className="text-muted">
            by {this.props.story.by}
          </Card.Subtitle>
          <Card.Text>{storyText}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}
// Maximum length of story text before being shortened when card is collapsed
const maxLength = 25;

export default ChartContainer;
