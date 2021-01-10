'use strict'
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')
const qs = require('qs')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async update(ctx) {
    const { id } = ctx.params

    let entity

    const [course] = await strapi.services.course.find({
      id: ctx.params.id,
      'instructorId.id': ctx.state.user.id,
    })

    if (!course) {
      return ctx.unauthorized(`You can't update this entry`)
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx)
      entity = await strapi.services.course.update({ id }, data, {
        files,
      })
    } else {
      entity = await strapi.services.course.update({ id }, ctx.request.body)
    }

    return sanitizeEntity(entity, { model: strapi.models.course })
  },
  async create(ctx) {
    let entity
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx)
      data.instructorId = ctx.state.user.id
      entity = await strapi.services.course.create(data, { files })
    } else {
      ctx.request.body.instructorId = ctx.state.user.id
      entity = await strapi.services.course.create(ctx.request.body)
    }
    return sanitizeEntity(entity, { model: strapi.models.course })
  },
  async delete(ctx) {
    const { id } = ctx.params

    const [course] = await strapi.services.course.find({
      id: ctx.params.id,
      'instructorId.id': ctx.state.user.id,
    })

    if (!course) {
      return ctx.unauthorized(`You can't update this entry`)
    }

    const entity = await strapi.services.course.delete({ id })
    return sanitizeEntity(entity, { model: strapi.models.course })
  },
  async find(ctx) {
    console.log(ctx.query)
    let entities
    if (ctx.query._q) {
      entities = await strapi.services.course.search(ctx.query)
    } else {
      entities = await strapi.services.course.find(ctx.query)
    }

    return entities.map((entity) => {
      const course = sanitizeEntity(entity, {
        model: strapi.models.course,
      })

      if (course.chaptersId) {
        course.chaptersId.forEach((chapter) => {
          if (chapter) {
            delete chapter.ytbUrl
          }
        })
      }
      return course
    })
  },
  async findOne(ctx) {
    const { id } = ctx.params

    const entity = await strapi.services.course.findOne({ id })
    const course = sanitizeEntity(entity, { model: strapi.models.course })
    if (course.chaptersId) {
      course.chaptersId.forEach((chapter) => {
        if (chapter) {
          delete chapter.ytbUrl
        }
      })
    }
    return course
  },
  async findByStudent(ctx) {
    const { id, findByStudent } = ctx.params
    console.log(ctx.params)

    const entities = await strapi.services['student-course'].find({
      'userId.id': ctx.state.user.id,
    })

    console.log(entities.length);

    if (findByStudent === 'findOneByStudent') {
      let flag = false
      entities.map((entity) => {
        if (entity.courseId.id === id) {
          flag = true;
        }
      })

      if (!flag) {
        return ctx.unauthorized(`You can't read this entry`)
      }
      console.log('H')
      const entity = await strapi.services.course.findOne({ id })
      const course = sanitizeEntity(entity, { model: strapi.models.course })
      return course
    }

    let listIdCourse = {
      id_in: [],
    }

    entities.map((entity) => {
      listIdCourse.id_in.push(entity.courseId.id)
    })

    console.log('course.findByStudent: ' + listIdCourse)
    const entity = await strapi.services.course.find(listIdCourse)
    // return ctx.query;
    return sanitizeEntity(entity, { model: strapi.models.course })
  },
  async create(ctx) {
    let entity
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx)
      data.instructorId = ctx.state.user.id
      entity = await strapi.services.course.create(data, { files })
    } else {
      ctx.request.body.instructorId = ctx.state.user.id
      entity = await strapi.services.course.create(ctx.request.body)
    }
    return sanitizeEntity(entity, { model: strapi.models.course })
  },
  //   async findByStudent(ctx) {
  //     console.log(ctx.params)
  //     const entities = await strapi.services['student-course'].find({
  //         'userId.id': ctx.state.user.id,
  //     });

  //     console.log(entities);

  //     return entities.map((entity) => {
  //         const studentCourse = sanitizeEntity(entity, {
  //           model: strapi.models['student-course'],
  //         })

  //         return studentCourse
  //       })

  //     return 'Hello world'
  //   },
}
