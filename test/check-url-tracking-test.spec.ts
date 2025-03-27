import { expect } from 'chai';
import { checkUrlForTracking } from '../src/helpers';
import { each } from 'lodash';

describe('Check URL Tracking Tests', function () {
    describe('#checkUrlForTracking()', function () {
        const testHash: {
            testName: string,
            inputUrl: string,
            expected: boolean,
        }[] = [
            {
                testName: '1 HTTPS URL containing tracking',
                inputUrl: 'https://duckduckgo.com/?t=ffab&q=unit+testing+frameworks+for+typescript&ia=web',
                expected: true,
            },
            {
                testName: '1 HTTPS URL without tracking',
                inputUrl: 'https://www.google.com/',
                expected: false,
            },
            {
                testName: '1 HTTP URL with tracking',
                inputUrl: 'http://duckduckgo.com/?t=ffab&q=unit+testing+frameworks+for+typescript&ia=web',
                expected: true,
            },
            {
                testName: '1 HTTP URL without tracking',
                inputUrl: 'http://www.google.com/',
                expected: false,
            },
            {
                testName: 'TikTok URL',
                inputUrl: 'https://www.tiktok.com/@moreperfectunion/video/7483541163362848030?sender_device=pc',
                expected: true,
            }
        ];

        each(testHash, function (test) {
            it(test.testName, function () {
                expect(checkUrlForTracking(test.inputUrl)).to.eq(test.expected);
            });
        });
    });
});
