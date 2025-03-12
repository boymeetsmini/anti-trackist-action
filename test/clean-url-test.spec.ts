import { expect } from 'chai';
import { cleanUrl } from '../src/helpers';

describe('Clean URL Tests', function () {
    describe('#cleanUrl()', function () {
        it('Message with 1 URL containing tracking', async function () {
            expect(
                await cleanUrl('https://duckduckgo.com/?t=ffab&q=unit+testing+frameworks+for+typescript&ia=web')
            )
            .to.eq('https://duckduckgo.com/?q=unit+testing+frameworks+for+typescript');
        });
    });
});
