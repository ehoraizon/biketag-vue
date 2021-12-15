import { builder, Handler } from '@netlify/functions'
import { getBikeTagClientOpts, getPayloadOpts } from '../src/common/methods'
import { BikeTagClient } from 'biketag'
import { getSettingsPayload } from 'biketag/lib/common/payloads'
import { Game } from 'biketag/lib/common/schema'

const myHandler: Handler = async (event) => {
  const biketagOpts = getBikeTagClientOpts(event)
  const biketag = new BikeTagClient(biketagOpts)
  const game = (await biketag.getGame(biketagOpts.game, {
    source: 'sanity',
    concise: true,
  })) as unknown as Game
  const biketagPayload = getPayloadOpts(
    event.rawQuery,
    {
      imgur: {
        hash: game.mainhash,
      },
    },
    biketagOpts.game
  )
  const settingsResponse = await biketag.getSettings(biketagPayload as getSettingsPayload, {
    source: 'imgur',
  })
  const { success, data } = settingsResponse
  console.log({ biketagOpts, biketagPayload, game })

  return {
    statusCode: settingsResponse.status,
    body: JSON.stringify(success ? data : settingsResponse),
  }
}

const handler = builder(myHandler)

export { handler }