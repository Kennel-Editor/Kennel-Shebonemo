import React from 'react'
import {Stack, Text, Card} from '@sanity/ui'
import {set, unset} from 'sanity'

const CustomImageArrayInput = React.forwardRef((props, ref) => {
  const {value = [], onChange, renderDefault} = props

  const max = 8
  const showWarning = value.length > max

  return (
    <Stack space={3}>
      {renderDefault(props)}
      {showWarning && (
        <Card tone="caution" padding={3} radius={2} shadow={1}>
          <Text size={2} weight="semibold">
            ⚠️ Du har lagt til {value.length} bilder. Maks er {max}.
          </Text>
        </Card>
      )}
    </Stack>
  )
})

export default CustomImageArrayInput
