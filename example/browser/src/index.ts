import { Mastodon, Entity, Response } from 'megalodon'

const BASE_URL: string = 'http://mastodon.social'
console.log('start')

const client = new Mastodon(BASE_URL)

client.getInstance().then((res: Response<Entity.Instance>) => {
  console.log(res)
})
