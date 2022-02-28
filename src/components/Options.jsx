import React from "react";
import { classSelectors } from "../utils/selectors";

let asyncOptionsCache = [];

export class Options extends React.Component {
  constructor(props) {
    super(props);

    const { cacheAsyncOptions, options } = this.props;

    this._isMounted = false;

    this.state = {
      filter: "",
      asyncFns: options.filter(opt => typeof opt == "function"),
      asyncOptions: cacheAsyncOptions ? asyncOptionsCache : [],
      loading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadAsyncOptions();
  }

  componentWillUnmount() {
    this._isMounted = false;
 }

  loadAsyncOptions(searchPattern) {
    const { asyncFns } = this.state;

    this.setState({ loading: true });

    Promise.all(asyncFns.map(fn => fn(searchPattern))).then(data => {
      data = data.reduce((v, a) => v.concat(a), []);

      // Naive comparison (these are arrays and the data they contain should be
      // in the same order)
      const eq = JSON.stringify(asyncOptionsCache) == JSON.stringify(data);

      asyncOptionsCache = data;

      // We use "eq" because we don't want to update the options (causing a DOM
      // reflow) if there are no new options to be rendered
      if(!eq && this._isMounted) {
        this.setState({
          asyncOptions: data,
          loading: false,
        });
      }
    });
  }

  render() {
    const {
      tags,
      options,
      OptionComponent,
    } = this.props;

    const { asyncOptions, loading } = this.state;

    let opts = options.filter(opt => typeof opt != "function").concat(asyncOptions);

    // Filter the options by the searchPatter (if any)
    if(this.state.filter) {
      opts = this.props.filter(opts, this.state.filter);
    }

    // Remove the options that are already selected
    const selectedValues = tags.map(tag => tag.value);
    opts = opts.filter(opt => !selectedValues.includes(opt.value));

    return (
      <div className={classSelectors.optionsWrapper}>

        <div className={classSelectors.filter}>
          <input
            placeholder="Search..."
            value={this.state.filter}
            onChange={(e) => {
              this.setState({ filter: e.target.value });
              this.loadAsyncOptions(e.target.value);
            }}
          />
        </div>

        { loading &&
          <div className={classSelectors.loader}>
            <div className="spinner"></div>
            <div>Some options are still loading, please wait...</div>
          </div>
        }

        {
          (!loading && opts.length == 0) ? (
            <div className={classSelectors.message}>
              <div>There are no options</div>
            </div>
          ) : ""
        }

        <div className={classSelectors.options}>
          {
            opts.map(option => {
              return (
                <div
                  key={option.value}
                  onClick={() => this.props.select(option.value)}
                >
                  <OptionComponent option={option}></OptionComponent>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}