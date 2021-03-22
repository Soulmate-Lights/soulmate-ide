import slugify from '~/utils/slugify';

export const sketchUrl = (sketch) => (
  `/gallery/${sketch.id}-${slugify(sketch.name)}`
)

export const userUrl = (user) => (
  `/user/${user.id}-${slugify(user.name)}`
)
