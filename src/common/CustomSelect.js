import { components } from "react-select";
const TextOption = (props) =>
  components.Option && (
    <components.Option {...props}>
      {props.data.label}
      &nbsp;<span className="dropdown-badge badge">{props.data.shortForm}</span>
    </components.Option>
  );

const addDataAcceptance = (Component, dataAcceptance) => (props) =>
  (
    <Component
      {...props}
      innerProps={Object.assign({}, props.innerProps, {
        "data-acceptance": dataAcceptance,
      })}
    />
  );

export const CUSTOM_COMPONENTS = {
  Option: addDataAcceptance(TextOption, "TextOption"),
  Menu: addDataAcceptance(components.Menu, "Menu"),
};
