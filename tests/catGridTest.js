import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CatGrid from '../src/components/catGrid';

function setup() {
  let cats = [
      {
        fact: "Cats save lives",
        factLength: 15,
        pic: "http://27.media.tumblr.com/tumblr_lhufv7BgIY1qfyzelo1_1280.jpg"
      },
      {
        fact: "Cats grow corn",
        factLength: 14,
        pic: "http://25.media.tumblr.com/tumblr_luvj5sMdhZ1qgnva2o1_500.jpg"
      },
      {
        fact: "Cats have cured cancer",
        factLength: 22,
        pic: "http://24.media.tumblr.com/tumblr_m2ka8oZR751qf4k86o1_500.png"
      }
  ];

  let renderer = TestUtils.createRenderer()
  renderer.render(<CatGrid cats={cats} />)
  let output = renderer.getRenderOutput()

  return {
    cats,
    output,
    renderer
  }
}

describe('CatGrid Component', () => {
  it('should render a grid of cats', () => {
    const { output } = setup();

    expect(output.type).toBe('div');
    expect(output.props.children.length).toBe(3)
  });
});
