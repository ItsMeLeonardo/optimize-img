import { Cloudinary } from '@cloudinary/url-gen'

const cloud = new Cloudinary({
  cloud: {
    cloudName: 'leonardoblog',
  },
  url: {
    secure: true,
  },
})

export default cloud
