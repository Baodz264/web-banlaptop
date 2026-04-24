import TopicRepository from "./topic.repository.js";
import Topic from "../../database/mysql/cms/topic.model.js";
import slugify from "../../utils/slugify.js";

class TopicService {

  static async getTopics(query) {
    return await TopicRepository.findAll(query);
  }

  static async getTopicById(id) {

    const topic = await TopicRepository.findById(id);

    if (!topic) {
      throw new Error("Không tìm thấy chủ đề");
    }

    return topic;
  }

  static async createTopic(data) {

    if (!data.slug && data.name) {
      data.slug = slugify(data.name);
    }

    const exist = await Topic.findOne({
      where: { slug: data.slug }
    });

    if (exist) {
      throw new Error("Slug đã tồn tại");
    }

    return await TopicRepository.create(data);
  }

  static async updateTopic(id, data) {

    const topic = await TopicRepository.findById(id);

    if (!topic) {
      throw new Error("Không tìm thấy chủ đề");
    }

    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }

    if (data.slug) {
      const exist = await Topic.findOne({
        where: { slug: data.slug }
      });

      if (exist && exist.id !== Number(id)) {
        throw new Error("Slug đã tồn tại");
      }
    }

    return await TopicRepository.update(id, data);
  }

  static async deleteTopic(id) {

    const topic = await TopicRepository.findById(id);

    if (!topic) {
      throw new Error("Không tìm thấy chủ đề");
    }

    return await TopicRepository.delete(id);
  }
}

export default TopicService;
