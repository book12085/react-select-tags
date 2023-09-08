import React from "react";
import { classSelectors } from "../utils/selectors";

export class Options extends React.Component {
  constructor(props) {
    super(props);

    const {
      options,
      cacheAsyncOptions,
      asyncOptionsCacheStore,
    } = this.props;

    this._isMounted = false;

    this.state = {
      filter: props.root.state.filter,
      asyncFns: options.filter(opt => typeof opt == "function"),
      asyncOptions: cacheAsyncOptions ? asyncOptionsCacheStore.current : [],
      loading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    // this.setState({ filter: root.state.filter });
    this.loadAsyncOptions(this.state.filter);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.root.setState({ filter: this.state.filter });
 }

  getGroupedOptions(options) {
    const groups = new Set(options.map(opt => opt.group));

    const opts = new Map();
    groups.forEach(group => {
      opts.set(group, options.filter(opt => opt.group == group));
    });
    return [...opts];
  }

  loadAsyncOptions(searchPattern) {
    const { asyncFns } = this.state;
    const { asyncOptionsCacheStore } = this.props;

    this.setState({ loading: true });

    Promise.all(asyncFns.map(fn => fn(searchPattern))).then(data => {
      data = data.reduce((v, a) => v.concat(a), []);

      asyncOptionsCacheStore.current = data;

      this._isMounted && this.setState({
        asyncOptions: data,
      });
    }).catch(() => {}).finally(() => {
      this._isMounted && this.setState({
        loading: false,
      });
    });
  }

  render() {
    const {
      tags,
      options,
      GroupComponent,
      OptionComponent,
      NotificatorComponent,
    } = this.props;

    const { asyncOptions, loading } = this.state;
    const { root, extra_props } = this.props;

    let opts = options.filter(opt => typeof opt != "function").concat(asyncOptions);

    // Filter the options by the searchPattern (if any)
    opts = this.props.filter(opts, root.state.filter);

    // Remove the options that are already selected
    const selectedValues = tags.map(tag => tag.value);
    opts = opts.filter(opt => !selectedValues.includes(opt.value));

    // Extract groups (if any)
    opts = this.getGroupedOptions(opts);

    return (
      <div className={classSelectors.optionsWrapper}>
        <NotificatorComponent
          loading={loading}
          options={opts}
          root={root}
          extra_props={extra_props}
        ></NotificatorComponent>

        <div className={classSelectors.options}>
          {
            opts.map(([group, options], idx) => {

              return (
                <div key={`${idx}-group`}>
                  <GroupComponent
                    group={group}
                    root={root}
                    extra_props={extra_props}
                  ></GroupComponent>

                  {
                    options.map((option, idx2) => {
                      return (
                        <div
                          key={`${idx2}-${option.value}`}
                          onClick={() => this.props.select(option.value)}
                        >
                          <OptionComponent
                            option={option}
                            root={root}
                            extra_props={extra_props}
                          ></OptionComponent>
                        </div>
                      )
                    })
                  }

                </div>
              );

            })
          }
        </div>
      </div>
    );
  }
}