import type { Meta, StoryObj } from '@storybook/react'

import OrdersPage from './OrdersPage'

const meta: Meta<typeof OrdersPage> = {
  component: OrdersPage,
}

export default meta

type Story = StoryObj<typeof OrdersPage>

export const Primary: Story = {}
