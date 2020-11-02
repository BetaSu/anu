'use strict';

const React = require("react");
const ReactDOM = require("react-dom");
const ReactTestUtils = require("test-utils");

describe('ReactFragment', () => {

  it("findDOMNode should find dom element", () => {
      class MyNode extends React.Component {
          render() {
              return (
                  <div>
                      <span>Noise</span>
                  </div>
              );
          }
      }

      const myNode = ReactTestUtils.renderIntoDocument(<MyNode />);
      const myDiv = ReactDOM.findDOMNode(myNode);
      const mySameDiv = ReactDOM.findDOMNode(myDiv);
      expect(myDiv.tagName).toBe("DIV");
      expect(mySameDiv).toBe(myDiv);
  });

  function createRoot() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
  }

  it('should render a single child via DOM renderer', () => {
    const element = (
      <>
        <span>foo</span>
      </>
    );

    const root = createRoot();
    ReactDOM.render(element, root);
    expect(root.innerHTML).toEqual('<span>foo</span>');
  });

  it('should render zero children via DOM renderer', () => {
    const element = <React.Fragment />;

    const root = createRoot();
    ReactDOM.render(element, root);
    expect(root.innerHTML).toEqual('');
  });

  it('should render multiple children via DOM renderer', () => {
    const element = (
      <>
        hello <span>world</span>
      </>
    );

    const root = createRoot();
    ReactDOM.render(element, root);
    expect(root.innerHTML).toEqual('hello <span>world</span>');

  });

  it('should render an iterable via DOM renderer', () => {
    const element = (
      <>{new Set([<span key="a">hi</span>, <span key="b">bye</span>])}</>
    );

    const root = createRoot();
    ReactDOM.render(element, root);

    expect(root.innerHTML).toEqual('<span>hi</span><span>bye</span>');
  });

  // it('should preserve state of children with 1 level nesting', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <Stateful key="a" />
  //     ) : (
  //       <>
  //         <Stateful key="a" />
  //         <div key="b">World</div>
  //       </>
  //     );
  //   }

  //   const root = createRoot();
  //   ReactDOM.render(<Foo condition={true} />, root);

  //   ReactDOM.render(<Foo condition={false} />, root);

  //   expect(ops).toEqual(['Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div(), div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should preserve state between top-level fragments', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>
  //         <Stateful />
  //       </>
  //     ) : (
  //       <>
  //         <Stateful />
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should preserve state of children nested at same level', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>
  //         <>
  //           <>
  //             <Stateful key="a" />
  //           </>
  //         </>
  //       </>
  //     ) : (
  //       <>
  //         <>
  //           <>
  //             <div />
  //             <Stateful key="a" />
  //           </>
  //         </>
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div(), div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state in non-top-level fragment nesting', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>
  //         <>
  //           <Stateful key="a" />
  //         </>
  //       </>
  //     ) : (
  //       <>
  //         <Stateful key="a" />
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state of children if nested 2 levels without siblings', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <Stateful key="a" />
  //     ) : (
  //       <>
  //         <>
  //           <Stateful key="a" />
  //         </>
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state of children if nested 2 levels with siblings', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <Stateful key="a" />
  //     ) : (
  //       <>
  //         <>
  //           <Stateful key="a" />
  //         </>
  //         <div />
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div(), div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should preserve state between array nested in fragment and fragment', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>
  //         <Stateful key="a" />
  //       </>
  //     ) : (
  //       <>{[<Stateful key="a" />]}</>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should preserve state between top level fragment and array', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       [<Stateful key="a" />]
  //     ) : (
  //       <>
  //         <Stateful key="a" />
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state between array nested in fragment and double nested fragment', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>{[<Stateful key="a" />]}</>
  //     ) : (
  //       <>
  //         <>
  //           <Stateful key="a" />
  //         </>
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state between array nested in fragment and double nested array', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>{[<Stateful key="a" />]}</>
  //     ) : (
  //       [[<Stateful key="a" />]]
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should preserve state between double nested fragment and double nested array', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>
  //         <>
  //           <Stateful key="a" />
  //         </>
  //       </>
  //     ) : (
  //       [[<Stateful key="a" />]]
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state of children when the keys are different', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <React.Fragment key="a">
  //         <Stateful />
  //       </React.Fragment>
  //     ) : (
  //       <React.Fragment key="b">
  //         <Stateful />
  //         <span>World</span>
  //       </React.Fragment>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div(), span()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state between unkeyed and keyed fragment', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <React.Fragment key="a">
  //         <Stateful />
  //       </React.Fragment>
  //     ) : (
  //       <>
  //         <Stateful />
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should preserve state with reordering in multiple levels', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <div>
  //         <React.Fragment key="c">
  //           <span>foo</span>
  //           <div key="b">
  //             <Stateful key="a" />
  //           </div>
  //         </React.Fragment>
  //         <span>boop</span>
  //       </div>
  //     ) : (
  //       <div>
  //         <span>beep</span>
  //         <React.Fragment key="c">
  //           <div key="b">
  //             <Stateful key="a" />
  //           </div>
  //           <span>bar</span>
  //         </React.Fragment>
  //       </div>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div(span(), div(div()), span())]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([div(span(), div(div()), span())]);
  // });

  // it('should not preserve state when switching to a keyed fragment to an array', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <div>
  //         {
  //           <React.Fragment key="foo">
  //             <Stateful />
  //           </React.Fragment>
  //         }
  //         <span />
  //       </div>
  //     ) : (
  //       <div>
  //         {[<Stateful />]}
  //         <span />
  //       </div>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(() => expect(Scheduler).toFlushWithoutYielding()).toErrorDev(
  //     'Each child in a list should have a unique "key" prop.',
  //   );

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div(div(), span())]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div(div(), span())]);
  // });

  // it('should not preserve state when switching a nested unkeyed fragment to a passthrough component', function() {
  //   const ops = [];

  //   function Passthrough({children}) {
  //     return children;
  //   }

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>
  //         <>
  //           <Stateful />
  //         </>
  //       </>
  //     ) : (
  //       <>
  //         <Passthrough>
  //           <Stateful />
  //         </Passthrough>
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state when switching a nested keyed fragment to a passthrough component', function() {
  //   const ops = [];

  //   function Passthrough({children}) {
  //     return children;
  //   }

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>
  //         <React.Fragment key="a">
  //           <Stateful />
  //         </React.Fragment>
  //       </>
  //     ) : (
  //       <>
  //         <Passthrough>
  //           <Stateful />
  //         </Passthrough>
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should not preserve state when switching a nested keyed array to a passthrough component', function() {
  //   const ops = [];

  //   function Passthrough({children}) {
  //     return children;
  //   }

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition ? (
  //       <>{[<Stateful key="a" />]}</>
  //     ) : (
  //       <>
  //         <Passthrough>
  //           <Stateful />
  //         </Passthrough>
  //       </>
  //     );
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   ReactNoop.render(<Foo condition={false} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual([]);
  //   expect(ReactNoop.getChildren()).toEqual([div()]);
  // });

  // it('should preserve state when it does not change positions', function() {
  //   const ops = [];

  //   class Stateful extends React.Component {
  //     componentDidUpdate() {
  //       ops.push('Update Stateful');
  //     }

  //     render() {
  //       return <div>Hello</div>;
  //     }
  //   }

  //   function Foo({condition}) {
  //     return condition
  //       ? [
  //           <span />,
  //           <>
  //             <Stateful />
  //           </>,
  //         ]
  //       : [
  //           <span />,
  //           <>
  //             <Stateful />
  //           </>,
  //         ];
  //   }

  //   ReactNoop.render(<Foo condition={true} />);
  //   expect(() => expect(Scheduler).toFlushWithoutYielding()).toErrorDev(
  //     'Each child in a list should have a unique "key" prop.',
  //   );

  //   ReactNoop.render(<Foo condition={false} />);
  //   // The key warning gets deduped because it's in the same component.
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([span(), div()]);

  //   ReactNoop.render(<Foo condition={true} />);
  //   // The key warning gets deduped because it's in the same component.
  //   expect(Scheduler).toFlushWithoutYielding();

  //   expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
  //   expect(ReactNoop.getChildren()).toEqual([span(), div()]);
  // });
});
