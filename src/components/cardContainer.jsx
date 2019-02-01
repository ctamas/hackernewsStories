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

  handleExpand = () => {
    this.setState({
      expanded: !this.state.expanded ? true : false
    });
  };

  // Handle long and short story from when card is expanded or closed
  getStoryText(text) {
    if (this.state.expanded || this.props.story.title.length < 25) {
      return text;
    } else {
      return text.slice(0, 25) + "...";
    }
  }

  render() {
    let expandedClass = this.state.expanded ? "card-expanded" : "";
    let storyText = this.getStoryText(this.props.story.title);
    return (
      <Card
        className={expandedClass}
        key={this.props.story.id}
        onClick={e => this.handleExpand(this.props.story.id, e)}
      >
        <Card.Body>
          &#9650;{this.props.story.score}
          <Card.Title>{this.props.story.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            by {this.props.story.by}
          </Card.Subtitle>
          <Card.Text>{storyText}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default ChartContainer;
