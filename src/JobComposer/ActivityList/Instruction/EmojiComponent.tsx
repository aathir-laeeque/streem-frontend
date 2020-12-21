import React, { Component } from 'react';

class LayoutComponent extends Component {
  onChange = (event): void => {
    const { onChange } = this.props;
    onChange(event.target.innerHTML);
  };

  renderEmojiModal() {
    const {
      config: { popupClassName = '', emojis },
    } = this.props;
    return (
      <div
        className={`rdw-emoji-modal ${popupClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {emojis.map((Emoji, index) => (
          <span
            key={index}
            className="rdw-emoji-icon"
            alt=""
            title={Emoji.name}
            onClick={this.onChange}
          >
            {Emoji.value}
          </span>
        ))}
      </div>
    );
  }

  render() {
    const {
      config: { icon, className, title },
      expanded,
      onExpandEvent,
      translations,
    } = this.props;
    return (
      <div
        className="rdw-emoji-wrapper"
        aria-haspopup="true"
        aria-label="rdw-emoji-control"
        aria-expanded={expanded}
        title={title || translations['components.controls.emoji.emoji']}
      >
        <div
          className="rdw-option-wrapper"
          // value="unordered-list-item"
          onClick={onExpandEvent}
        >
          <img src={icon} alt="" />
        </div>
        {expanded ? this.renderEmojiModal() : undefined}
      </div>
    );
  }
}

export default LayoutComponent;
