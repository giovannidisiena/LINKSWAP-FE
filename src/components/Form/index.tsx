import React from 'react'
import styled from 'styled-components'
import { FieldProps } from '../Field'

import CryptoJS from 'crypto-js'
import axios from 'axios'

const FormBody = styled.form`
  width: 100%;
  margin: 0;
  padding: 0;
`

const FormContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
`

export interface Fields {
  [key: string]: FieldProps
}

interface FormProps {
  action: string
  apiKey?: string
  fields: Fields
  render: () => React.ReactNode
}

export interface Values {
  [key: string]: any
}

export interface Errors {
  [key: string]: string
}

export interface FormState {
  values: Values
  errors: Errors
  submitSuccess?: boolean
}

export interface InterfaceFormContext extends FormState {
  setValues: (values: Values) => void
  validate: (fieldName: string) => void
}

export const FormContext = React.createContext<any | undefined>(undefined)

export const required = (values: Values, fieldName: string): string =>
  values[fieldName] === undefined || values[fieldName] === null || values[fieldName] === '' ? 'requiredField' : ''

export const isEmail = (values: Values, fieldName: string): string =>
  values[fieldName] === undefined ||
  values[fieldName] === null ||
  values[fieldName] === '' ||
  values[fieldName].search(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    ? 'invalidEmail'
    : ''

export class Form extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props)

    const errors: Errors = {}
    const values: Values = {}
    this.state = {
      errors,
      values
    }
  }

  /**
   * Returns whether there are any errors in the errors object that is passed in
   * @param {Errors} errors - The field errors
   */
  private haveErrors(errors: Errors) {
    let haveError = false
    Object.keys(errors).map((key: string) => {
      if (errors[key].length > 0) {
        haveError = true
      }
    })
    return haveError
  }

  /**
   * Handles form submission
   * @param {React.FormEvent<HTMLFormElement>} e - The form event
   */
  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const data = new FormData(e.target as HTMLFormElement)
    const formData = {}
    for (const pair of data.entries()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      formData[pair[0]] = pair[1] === 'true' ? true : pair[1]
    }

    if (this.validateForm()) {
      const submitSuccess: boolean = await this.submitForm(formData)
      this.setState({ submitSuccess })
    }
  }

  /**
   * Executes the validation rules for all the fields on the form and sets the error state
   * @returns {boolean} - Whether the form is valid or not
   */
  private validateForm(): boolean {
    const errors: Errors = {}
    Object.keys(this.props.fields).map((fieldName: string) => {
      errors[fieldName] = this.validate(fieldName)
    })
    this.setState({ errors })
    return !this.haveErrors(errors)
  }

  /**
   * Submits the form to the http api
   * @returns {boolean} - Whether the form submission was successful or not
   */
  private async submitForm(formData: any): Promise<boolean> {
    const sk = 'SK-WFU979BC-4XNRRBQG-THFQ8D3W-ZXD2UY4Z'
    const details = JSON.stringify(formData)
    try {
      const timestamp = new Date().getTime()
      const url = `${this.props.action}/v3/orders/reserve?timestamp=${timestamp}`
      const signature = (url: string, data: string) => {
        const dataToBeSigned = url + data
        // @ts-ignore
        const token = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataToBeSigned.toString(CryptoJS.enc.Utf8), sk))
        return token
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const headers = {}
      // @ts-ignore
      headers['Content-Type'] = 'application/json'
      // @ts-ignore
      headers['X-Api-Key'] = this.props.apiKey
      // @ts-ignore
      headers['X-Api-Signature'] = signature(url, details)
      const config = {
        method: 'POST',
        url: url,
        headers: headers,
        data: details
      }
      // @ts-ignore
      const response = await axios(config)
      console.log(response)
      return response.data
    } catch (error) {
      return false
    }
  }

  private setValues = (values: Values) => {
    this.setState({ values: { ...this.state.values, ...values } })
  }

  private validate = (fieldName: string): string => {
    let newError = ''

    if (this.props.fields[fieldName] && this.props.fields[fieldName].validation) {
      newError = this.props.fields[fieldName].validation!.rule(
        this.state.values,
        fieldName,
        this.props.fields[fieldName].validation!.args
      )
    }
    this.state.errors[fieldName] = newError
    this.setState({
      errors: { ...this.state.errors, [fieldName]: newError }
    })
    return newError
  }

  public render() {
    const { submitSuccess, errors } = this.state
    const context: InterfaceFormContext = {
      ...this.state,
      setValues: this.setValues,
      validate: this.validate
    }

    return (
      <FormContext.Provider value={context}>
        <FormBody onSubmit={this.handleSubmit} noValidate={true} autoComplete="off">
          <FormContainer>
            {this.props.render()}
            {submitSuccess && (
              <div className="alert alert-info" role="alert">
                The form was successfully submitted!
              </div>
            )}
            {submitSuccess === false && !this.haveErrors(errors) && (
              <div className="alert alert-danger" role="alert">
                Sorry, an unexpected error has occurred
              </div>
            )}
            {submitSuccess === false && this.haveErrors(errors) && (
              <div className="alert alert-danger" role="alert">
                Sorry, the form is invalid. Please review, adjust and try again
              </div>
            )}
          </FormContainer>
        </FormBody>
      </FormContext.Provider>
    )
  }
}