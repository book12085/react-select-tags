import React from "react";
import ReactDOM from "react-dom";
import ReactSelectTags from "../src/index";

const root = document.getElementById("root");

const NotificatorComponent = (props) => {
  const { loading, options } = props;

  if(loading) {
    return (
      <div style={{
        padding: "0.5rem 1.5rem",
        animation: "rainbow 2s linear infinite",
        backgroundImage: `linear-gradient(
          90deg,
          rgba(255, 0, 0, 1) 0%,
          rgba(255, 154, 0, 1) 10%,
          rgba(208, 222, 33, 1) 20%,
          rgba(79, 220, 74, 1) 30%,
          rgba(63, 218, 216, 1) 40%,
          rgba(47, 201, 226, 1) 50%,
          rgba(28, 127, 238, 1) 60%,
          rgba(95, 21, 242, 1) 70%,
          rgba(186, 12, 248, 1) 80%,
          rgba(251, 7, 217, 1) 90%,
          rgba(255, 0, 0, 1) 100%
        )`,
        backgroundSize: "200% 200%",
      }}>
        More colors are being loaded, hold on...
      </div>
    );
  }

  if(!loading && options.length == 0) {
    return (
      <div style={{
        padding: "0.5rem 1.5rem",
      }}>No colors were found</div>
    )
  }

  return "";
}

const OptionComponent = (props) => {
  return (
    <div style={{
      padding: "0.5rem 1.5rem",
      backgroundColor: props.option.value,
    }}>
      <span style={{
        filter: "invert(1)",
        mixBlendMode: "difference",
      }}>
        {`${props.option.label} (${props.option.value})`}
      </span>
    </div>
  )
}

const initialSettings = {
  options: [
    {label: "Green", value: "#66B132"},
    {label: "Blue-green", value: "#3E92CE"},
    {label: "Blue", value: "#3C47FE"},
    {label: "Blue-violet", value: "#3E02A4"},
    {label: "Violet", value: "#8601AF"},
    {label: "Red-violet", value: "#A7194B"},
    {label: "Red", value: "#F12815"},
    {label: "Red-orange", value: "#F2530B"},
    {label: "Orange", value: "#F49906"},
    {label: "Yellow-orange", value: "#F6BC02"},
    {label: "Yellow", value: "#FAFE33"},
    {label: "Yellow-green", value: "#D0EA2B"},

    (searchPattern) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            {label: "White", value: "white", group: "Dynamically loaded values"},
            {label: "Black", value: "black", group: "Dynamically loaded values"},
          ]);
        }, 3000);
      });
    }
  ],
  onChange: (tags) => {},
  placeholder: "Type and press enter",
  minTags: 1,
  maxTags: 10,
  editable: true,
  readOnly: false,
  removeOnBackspace: true,
  validator: null,
  keepOptionsOpenAfterSelect: false,
  cacheAsyncOptions: true,
  preloadAsyncOptions: true,
  swapLastValue: false,

  OptionComponent: null,
  NotificatorComponent: null,
};

function Example() {
  const [values, setValues] = React.useState([
    "#66B132", "#3E92CE",
  ]);
  const [settings, setSettings] = React.useState(initialSettings);
  console.log(values, settings);

  return (
    <div className="container pt-5" style={{maxWidth: "800px"}}>

      <h1>React Select Tags</h1>

      <div className="row mt-5">
        <div className="col">
          <ReactSelectTags
            {...settings}
            values={values}
            onChange={(value) => setValues(value)}
            className="my-custom-class"
          />
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12 mb-3">
          <label htmlFor="placeholder" className="form-label">Placeholder</label>
          <input
            id="placeholder"
            className="form-control"
            type="text"
            value={settings.placeholder}
            onChange={(e) => setSettings({ ...settings, placeholder: e.target.value })}
          />
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="minTags" className="form-label">Min tags</label>
          <input
            id="minTags"
            className="form-control"
            type="number"
            value={settings.minTags}
            onChange={(e) => setSettings({ ...settings, minTags: parseInt(e.target.value, 10) })}
          />
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="maxtags" className="form-label">Max tags</label>
          <input
            id="maxtags"
            className="form-control"
            type="number"
            value={settings.maxTags}
            onChange={(e) => setSettings({ ...settings, maxTags: parseInt(e.target.value, 10) })}
          />
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="editable"
              className="form-check-input"
              type="checkbox"
              checked={settings.editable}
              onChange={(e) => setSettings({ ...settings, editable: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="editable">Editable</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="readonly"
              className="form-check-input"
              type="checkbox"
              checked={settings.readOnly}
              onChange={(e) => setSettings({ ...settings, readOnly: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="readonly">Read only</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="keepOptionsOpenAfterSelect"
              className="form-check-input"
              type="checkbox"
              checked={settings.keepOptionsOpenAfterSelect}
              onChange={(e) => setSettings({ ...settings, keepOptionsOpenAfterSelect: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="keepOptionsOpenAfterSelect">Keep options list open after selection</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="removeonbackspace"
              className="form-check-input"
              type="checkbox"
              checked={settings.removeOnBackspace}
              onChange={(e) => setSettings({ ...settings, removeOnBackspace: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="removeonbackspace">Remove on backspace</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="validator"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.validator}
              onChange={(e) => setSettings({ ...settings, validator: e.target.checked ? (val) => val.indexOf("@") !== -1 : null })}
            />
            <label className="form-check-label" htmlFor="validator">Custom validator (validate if input contains "@")</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="OptionComponent"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.OptionComponent}
              onChange={(e) => setSettings({ ...settings, OptionComponent: e.target.checked ? OptionComponent : null })}
            />
            <label className="form-check-label" htmlFor="OptionComponent">Custom "Option" component</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="NotificatorComponent"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.NotificatorComponent}
              onChange={(e) => setSettings({ ...settings, NotificatorComponent: e.target.checked ? NotificatorComponent : null })}
            />
            <label className="form-check-label" htmlFor="NotificatorComponent">Custom "Notificator" component</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="cacheAsyncOptions"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.cacheAsyncOptions}
              onChange={(e) => setSettings({ ...settings, cacheAsyncOptions: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="cacheAsyncOptions">Cache async options</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="preloadAsyncOptions"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.preloadAsyncOptions}
              onChange={(e) => setSettings({ ...settings, preloadAsyncOptions: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="preloadAsyncOptions">Preload async options</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="swapLastValue"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.swapLastValue}
              onChange={(e) => setSettings({ ...settings, swapLastValue: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="swapLastValue">On selection, if max tags limit is reached, swap the last selected value (instead of disabling the input)</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="dontShowOptionsListIfEmpty"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.dontShowOptionsListIfEmpty}
              onChange={(e) => setSettings({ ...settings, dontShowOptionsListIfEmpty: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="dontShowOptionsListIfEmpty">Don't show the options list if there are no options</label>
          </div>
        </div>

      </div>
    </div>
  );
}

ReactDOM.render(<Example/>, root);
