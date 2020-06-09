/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

export const componentApplicator = (map) => (Component) => (props) => (
  <Component {...map(props)} />
); // Aka A-Combinator

/**
 * Return The component passed to it with modified props
 * @param functor A function with takes props as input and return the transformed props with additional props
 * @param Component The component to whcih we want to pass the transformed props
 *
 * eg:
 * export default propsTransformer(p => ({ ...p, key1: value 1, key2: vlaue2 }), Component)
 *
 * when using connect from redux
 * export default connect(
 *   mapStateToProps,
 *   mapDispatchToProps,
 * )(propsTransformer((p) => ({ ...p }), Component));
 */
export const propsTransformer = (functor, Component) => (props) => (
  <Component {...functor(props)} />
);
