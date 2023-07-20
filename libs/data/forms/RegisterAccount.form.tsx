import { EDynamicFormField, IField } from '@app/modules'

export const REGISTER_ACCOUNT_FORM: IField[] = [
  {
    card: {
      fields: [
        {
          inline: [
            {
              label: 'Legal First Name',
              name: 'legalFirstName',
              placeholder: 'Enter First Name',
              rules: [
                {
                  message: 'Legal First Name is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
            {
              label: 'Legal Last Name',
              name: 'legalLastName',
              placeholder: 'Enter Last Name',
              rules: [
                {
                  message: 'Legal Last Name is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
          ],
        },
        {
          inline: [
            {
              label: 'Date of Birth',
              name: 'dateOfBirth',
              placeholder: 'YYYY / MM / DD',
              rules: [
                {
                  message: 'Date of Birth is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.DATE,
            },
            {
              label: 'Email',
              name: 'email',
              placeholder: 'Enter Email',
              rules: [
                {
                  message: 'Email is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.EMAIL,
            },
          ],
        },
        {
          inline: [
            {
              label: 'Tax ID Number/SNN',
              name: 'taxID',
              placeholder: 'Enter Tax ID Number',
              rules: [
                {
                  message: 'Tax ID Number is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
            {
              label: 'Tax State',
              name: 'taxState',
              placeholder: 'Enter Tax State',
              rules: [
                {
                  message: 'Tax State is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
          ],
        },
        {
          inline: [
            {
              label: 'Tax Country',
              name: 'taxCountry',
              placeholder: 'Enter Tax Country',
              rules: [
                {
                  message: 'Tax Country is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
            {},
          ],
        },
      ],
      title: 'Legal Information',
    },
  },
  {
    card: {
      fields: [
        {
          inline: [
            {
              label: 'Street Address 1',
              name: 'streetAddress-1',
              placeholder: 'Enter Your Street Address',
              rules: [
                {
                  message: 'Street Address 1 is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
            {
              label: 'Street Address 2',
              name: 'streetAddress-2',
              placeholder: 'Enter Your Street Address',
              rules: [
                {
                  message: 'Street Address 2 is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
          ],
        },
        {
          inline: [
            {
              label: 'City',
              name: 'city',
              placeholder: 'Enter Your City',
              rules: [
                {
                  message: 'City is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
            {
              label: 'State',
              name: 'state',
              placeholder: 'Enter Your State',
              rules: [
                {
                  message: 'State is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
          ],
        },
        {
          inline: [
            {
              label: 'Postal Code',
              name: 'postalCode',
              placeholder: 'Enter Postal Code',
              rules: [
                {
                  message: 'Postal Code is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
            {
              label: 'Country',
              name: 'country',
              placeholder: 'Enter Country',
              rules: [
                {
                  message: 'Country is required',
                  required: true,
                },
              ],
              type: EDynamicFormField.INPUT,
            },
          ],
        },
      ],
      title: 'Personal Information',
    },
  },
]
