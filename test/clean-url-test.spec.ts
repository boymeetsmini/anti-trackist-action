import { expect } from 'chai';
import { cleanUrl } from '../src/helpers';
import { each } from 'lodash';

describe('Clean URL Tests', function () {
    describe('#cleanUrl()', function () {
        const testHash: {
            testName: string,
            inputUrl: string,
            expectedUrl: string,
        }[] = [
            {
                testName: '1 HTTPS URL containing tracking',
                inputUrl: 'https://duckduckgo.com/?t=ffab&q=unit+testing+frameworks+for+typescript&ia=web',
                expectedUrl: 'https://duckduckgo.com/?q=unit+testing+frameworks+for+typescript',
            },
            {
                testName: '1 HTTPS URL without tracking',
                inputUrl: 'https://www.google.com/',
                expectedUrl: 'https://www.google.com/',
            },
            {
                testName: '1 HTTP URL with tracking',
                inputUrl: 'http://duckduckgo.com/?t=ffab&q=unit+testing+frameworks+for+typescript&ia=web',
                expectedUrl: 'http://duckduckgo.com/?q=unit+testing+frameworks+for+typescript',
            },
            {
                testName: '1 HTTP URL without tracking',
                inputUrl: 'http://www.google.com/',
                expectedUrl: 'http://www.google.com/',
            }
        ];

        each(testHash, function (test) {
            it(test.testName, async function () {
                expect(await cleanUrl(test.inputUrl)).to.eq(test.expectedUrl);
            });
        });
    });
});
