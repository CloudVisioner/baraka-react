// @ts-nocheck
import React, { Component } from "react";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: "Ford",
      model: "Mustang",
      color: "red",
      year: 1964,
    };
  }

  changeDetail = () => {
    this.setState({ color: "blue", brand: "Tesla", model: "S", year: 2023 });
  };

  // componentDidMount() {
  //   console.log("componentWillMount");
  //   //runs after first render
  // }

  // componentWillUnmount()  {
  //   console.log("componentWillUnmount");
  //   //runs after first render
  // }

  // componentDidUpdate() {}

  render() {
    return (
      <div>
        <h1>My {this.state.brand}</h1>
        <p>
          It is a {this.state.color} {this.state.model}
          from {this.state.year}.
        </p>
        <button type="button" onClick={this.changeDetail}>
          Change Detail
        </button>
      </div>
    );
  }
}

export default Test;
