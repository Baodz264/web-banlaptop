import TopicService from "./topic.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class TopicController {

  getTopics = asyncHandler(async (req, res) => {

    const topics = await TopicService.getTopics(req.query);

    return response.success(res, topics);
  });

  getTopicById = asyncHandler(async (req, res) => {

    const topic = await TopicService.getTopicById(req.params.id);

    return response.success(res, topic);
  });

  createTopic = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    const topic = await TopicService.createTopic(data);

    return response.success(res, topic, "Topic created");
  });

  updateTopic = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    const topic = await TopicService.updateTopic(req.params.id, data);

    return response.success(res, topic, "Topic updated");
  });

  deleteTopic = asyncHandler(async (req, res) => {

    await TopicService.deleteTopic(req.params.id);

    return response.success(res, null, "Topic deleted");
  });
}

export default new TopicController();
