import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const PLACEHOLDER_TXT = 'Your message contains URLs with tracking info. Make sure to clean these up - thanks!';

export function cleanupModal(): ModalBuilder {
    // Create the modal
    const modal = new ModalBuilder()
        .setCustomId('cleanupModal')
        .setTitle('Anti-Trackist Action!');
    
    // ADD MODAL COMPONENTS //
    // Warning message (static text input)
    const warningMsgText = new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(PLACEHOLDER_TXT);

    // Add components to modal
    const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(warningMsgText);

    modal.addComponents(actionRow);
    return modal;
}