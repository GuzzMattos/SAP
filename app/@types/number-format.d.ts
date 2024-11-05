declare module 'react-number-format' {
    import { Component } from 'react';

    interface NumberFormatProps {
        value?: string | number;
        onValueChange?: (values: { floatValue?: number; formattedValue?: string }) => void;
        thousandSeparator?: string | boolean;
        decimalSeparator?: string;
        decimalScale?: number;
        fixedDecimalScale?: boolean;
        allowNegative?: boolean;
        placeholder?: string;
        className?: string;
        [key: string]: any; // Permite outras props do HTML
    }

    export default class NumberFormat extends Component<NumberFormatProps> { }
}