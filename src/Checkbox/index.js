// @flow
import type { SimpleTagPropsT } from '../Base';

import * as React from 'react';
import { MDCCheckbox } from '@material/checkbox/dist/mdc.checkbox';
import FormField from '../FormField';
import { simpleTag } from '../Base';
import { withFoundation, syncFoundationProp } from '../Base/withFoundation';
import { randomId } from '../Base/utils/randomId';

export const CheckboxRoot = simpleTag({
  displayName: 'CheckboxRoot',
  classNames: props => [
    'mdc-checkbox',
    {
      'mdc-checkbox--disabled': props.disabled
    }
  ],
  consumeProps: ['disabled']
});

export const CheckboxNativeControl = simpleTag({
  displayName: 'CheckboxNativeControl',

  tag: 'input',
  classNames: 'mdc-checkbox__native-control',
  defaultProps: {
    type: 'checkbox'
  }
});

export const CheckboxBackground = simpleTag({
  displayName: 'CheckboxBackground',
  classNames: 'mdc-checkbox__background'
});

export const CheckboxCheckmark = simpleTag({
  displayName: 'CheckboxCheckmark',
  tag: 'svg',
  classNames: 'mdc-checkbox__checkmark',
  defaultProps: {
    viewBox: '0 0 24 24'
  }
});

export const CheckboxCheckmarkPath = simpleTag({
  displayName: 'CheckboxCheckmarkPath',
  tag: 'path',
  classNames: 'mdc-checkbox__checkmark-path',
  defaultProps: {
    fill: 'none',
    stroke: 'white',
    d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
  }
});

export const CheckboxMixedmark = simpleTag({
  displayName: 'CheckboxMixedmark',
  classNames: 'mdc-checkbox__mixedmark'
});

export const CheckboxLabel = simpleTag({
  displayName: 'CheckboxLabel',
  tag: 'label'
});

export type CheckboxPropsT = {
  /** A DOM ID for the toggle. */
  id?: string,
  /** Disables the control. */
  disabled?: boolean,
  /** Toggle the control on and off. */
  checked?: boolean | string,
  /** The value of the control. */
  value?: boolean | string | number,
  /** Make the control indeterminate */
  indeterminate?: boolean,
  /** A label for the control. */
  label?: string
} & SimpleTagPropsT;

/**
 * A Checkbox component
 */
export class Checkbox extends withFoundation({
  constructor: MDCCheckbox,
  adapter: {}
})<CheckboxPropsT> {
  static displayName = 'Checkbox';

  constructor(props: CheckboxPropsT) {
    super(props);
    this.generatedId = randomId('checkbox');
  }

  componentDidMount() {
    super.componentDidMount();
    this.ripple_ = this.initRipple_();
  }

  syncWithProps(nextProps: CheckboxPropsT) {
    // checked
    syncFoundationProp(
      nextProps.checked,
      this.checked,
      () => (this.checked = nextProps.checked)
    );

    // indeterminate
    syncFoundationProp(
      nextProps.indeterminate,
      this.indeterminate,
      () => (this.indeterminate = nextProps.indeterminate)
    );

    // disabled
    syncFoundationProp(
      nextProps.disabled,
      this.disabled,
      () => (this.disabled = nextProps.disabled)
    );

    // value
    syncFoundationProp(
      nextProps.value,
      this.value,
      () => (this.value = nextProps.value)
    );
  }

  render() {
    const {
      label = '',
      id,
      children,
      checked,
      indeterminate,
      apiRef,
      ...rest
    } = this.props;

    const { root_ } = this.foundationRefs;
    const labelId = id || this.generatedId;

    const checkbox = (
      <CheckboxRoot
        elementRef={root_}
        disabled={rest.disabled}
        className={this.classes}
      >
        <CheckboxNativeControl id={labelId} checked={checked} {...rest} />
        <CheckboxBackground>
          <CheckboxCheckmark>
            <CheckboxCheckmarkPath />
          </CheckboxCheckmark>
          <CheckboxMixedmark />
        </CheckboxBackground>
      </CheckboxRoot>
    );

    /**
     * We have to conditionally wrap our checkbox in a formfield
     * If we have a label
     */
    if (label.length || children) {
      return (
        <FormField>
          {checkbox}
          <CheckboxLabel id={labelId + 'label'} htmlFor={labelId}>
            {label}
            {children}
          </CheckboxLabel>
        </FormField>
      );
    } else {
      return checkbox;
    }
  }
}

export default Checkbox;
