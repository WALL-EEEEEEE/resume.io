
// import "./card.css";
import React from "react";


const cardAction = (props) => {
  return (
    <div className="action">
      {props.children}
    </div>
  );
};

const cardSubtitle0 = (props) => {
  return (
    <div className="pvs-entity-header-title">
      <span>{props.value}</span>
    </div>
  );
};

const cardSubtitle1 = (props) => {
  return (
    <span className="t-normal">
      <span> {props.value} </span>{" "}
    </span>
  );
};
const cardSubtitle2 = (props) => {
  return (
    <span className="t-black--light">
      {" "}
      <span> {props.value} </span>
    </span>
  );
};
const cardContent = (props) => {
  return <p className="container">{props.children}</p>;
};

const Card = (props) => {
  let title = props.title;
  let subtitles0;
  let subtitles1;
  let subtitles2 = [];
   
  let actions = [
    [], //top left actions
    [], // top right actions
    [], // bottom left actions
    [], // bottom right actions
  ];
  let content;
  // console.log(props);
  React.Children.forEach(props.children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === cardAction) {
      switch (child.props.postion) {
        case "top-left":
          actions[0].push(child)
          break
        case "top-right":
          actions[1].push(child)
          break
        case "bottom-left":
          actions[2].push(child)
          break
        case "bottom-right":
          actions[3].push(child)
          break
        default:
          actions[1].push(child)
      }
      // console.log(actions)
    } else if (child.type == cardSubtitle0) {
      subtitles0 = child;
    } else if (child.type == cardSubtitle1) {
      subtitles1 = child;
    } else if (child.type == cardSubtitle2) {
      subtitles2.push(child);
    } else if (child.type == cardContent) {
      content = child;
    }
  });

  return (
    <section className="card">
      <div className="title">
        <span>{title}</span>
      </div>
      <div className="subtitle">
        {subtitles0}
        {subtitles1}
        {subtitles2}
      </div>
      <div className="content">{content}</div>
      { actions.map((group_actions, index) => {
        // console.log(index, group_actions)
        switch (index) {
          case 0:
            return (<div className="actions top-left-action" >{group_actions}</div>)
          case 1:
            return (<div className="actions top-right-action" >{group_actions}</div>)
          case 2:
            return (<div className="actions bottom-left-action" >{group_actions}</div>)
          case 3:
            return (<div className="actions bottom-right-action" >{group_actions}</div>)
        }
      }) 
      }
    </section>
  );
};
Card.Action = cardAction;
Card.Subtitle0 = cardSubtitle0;
Card.Subtitle1 = cardSubtitle1;
Card.Subtitle2 = cardSubtitle2;
Card.Content = cardContent;

export default Card;
