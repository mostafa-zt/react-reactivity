import React from 'react'
import { FieldInputProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'


interface IProps extends FieldInputProps<string, HTMLInputElement>, FormFieldProps { }

const TextInput: React.FC<IProps> = ({ input, width, type, meta: { touched, error } }) => {
    return (
        <Form.Field o error={touched && !!error} type={type} width={width}>
            <input {...input} placeholder='' />
            {touched && error && (<Label>{error}</Label>)}
        </Form.Field>
    )
}

export default TextInput
