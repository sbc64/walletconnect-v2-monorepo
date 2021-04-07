import "mocha";
import { expect } from "chai";
import pino from "pino";
import { getDefaultLoggerOptions } from "@pedrouid/pino-utils";
import { WakuService } from "../src/waku";
import { WakuMessage } from "../src/types";
import { hexToBuffer } from "enc-utils";
import { generateRandomBytes32 } from "../src/utils";

import { WAKU_TOPIC, TEST_WAKU_URL } from "./shared";

describe("Waku", () => {
  let wakuOne: WakuService;
  let wakuTwo: WakuService;
  let contentTopic: number;
  let testMessage: string;
  let stringTopic: string;
  before(() => {
    let logger = pino(getDefaultLoggerOptions({ level: "error" }));
    wakuOne = new WakuService(logger, TEST_WAKU_URL);
    wakuTwo = new WakuService(logger, TEST_WAKU_URL.replace("8546", "8547"));
  });
  beforeEach(() => {
    testMessage = generateRandomBytes32();
    contentTopic = hexToBuffer(generateRandomBytes32()).readUInt32BE();
    stringTopic = generateRandomBytes32();
  });
  it("Waku node has peers", async () => {
    let peers = await wakuOne.getPeers();
    expect(peers.length).to.be.greaterThan(0);
  });
  xit("Receives a content message from two waku with filter api of waku", function(done) {
    this.timeout(10000);
    wakuTwo.contentSubscribe(contentTopic);
    setTimeout(() => {
      wakuOne.postMessage(testMessage, stringTopic);
    }, 250);
    setTimeout(() => {
      wakuTwo.getContentMessages(contentTopic).then(m => {
        console.log("Message: ", m);
      });
    }, 500);
    setTimeout(() => {
      wakuTwo.getMessages(wakuTwo.namespace).then(m => {
        console.log("Message two: ", m);
        done();
        expect(m.length).to.greaterThan(0);
        expect(m[0].payload).to.equal(testMessage);
      });
    }, 600);
  });

  it("Receive message from two waku nodes with relay api of waku", function(done) {
    wakuTwo.subscribe(stringTopic);
    setTimeout(() => {
      wakuOne.postMessage(testMessage, stringTopic);
    }, 75);
    setTimeout(() => {
      wakuTwo.getMessages(stringTopic).then(m => {
        expect(m.length).to.be.greaterThan(0);
        expect(m[0].payload).to.equal(testMessage);
        done();
      });
    }, 200);
  });
  it("It polls for messages", function(done) {
    wakuOne.onNewTopicMessage(stringTopic, (messages: WakuMessage[]) => {
      expect(messages.length).to.equal(1);
      expect(messages[0].payload).to.equal(testMessage);
      done();
    });
    setTimeout(() => {
      wakuTwo.postMessage(testMessage, stringTopic);
    }, 750);
  });
  xit("Gets Historical waku messages from the waku store api", function(done) {
    let messages: string[] = new Array<string>(5);
    for (let i = 0; i < messages.length; i++) {
      messages[i] = generateRandomBytes32();
      wakuOne.postMessage(messages[i], stringTopic);
    }
  });
});