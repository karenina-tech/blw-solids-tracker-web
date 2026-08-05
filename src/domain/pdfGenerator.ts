import type { ChecklistItem } from '@/types/checklist';
import { CHECKLIST_TEMPLATE } from '@/templates/checklistTemplate';
import { formatDate, formatOrdinalDate } from '@/utils/formatDate';
import i18n from '@/i18n/config';

export function compileHtmlTemplate(
  babyName: string,
  startDate: string,
  items: ChecklistItem[],
  language: string = 'en'
): string {
  const t = (key: string) => i18n.t(key, { lng: language });

  const tableRowsHtml = items
    .map((item) => {
      const isAllergen = item.category.startsWith('Allergen');
      const badgeClass = isAllergen ? 'badge-allergen' : 'badge-standard';
      const [foodName, ...prepParts] = item.foodItem.split(' — ');
      const preparation = prepParts.join(' — ');
      const categoryLabel = t(`checklist.categoryLabels.${item.category}`);
      return `
      <tr>
        <td class="col-date">${formatOrdinalDate(item.date, language)}</td>
        <td class="col-food">
          <span class="food-name">${foodName}</span>${preparation ? `<span class="food-prep">${preparation}</span>` : ''}
        </td>
        <td class="col-cat"><span class="badge ${badgeClass}">${categoryLabel}</span></td>
        <td class="col-chk"></td>
        <td class="col-notes"></td>
      </tr>`;
    })
    .join('');

  return CHECKLIST_TEMPLATE
    .replace('{{TITLE}}', i18n.t('checklist.title', { lng: language, name: babyName }))
    .replace('{{SUBTITLE}}', t('checklist.subtitle'))
    .replace('{{START_DATE_LABEL}}', t('checklist.startDateLabel'))
    .replace('{{START_DATE}}', formatDate(startDate, language))
    .replace('{{BADGE}}', t('checklist.badge'))
    .replace('{{MONITORING_INSTRUCTIONS}}', t('checklist.monitoringInstructions'))
    .replace('{{COL_DATE}}', t('checklist.columns.date'))
    .replace('{{COL_FOOD}}', t('checklist.columns.food'))
    .replace('{{COL_CATEGORY}}', t('checklist.columns.category'))
    .replace('{{COL_OFFERED}}', t('checklist.columns.offered'))
    .replace('{{COL_NOTES}}', t('checklist.columns.notes'))
    .replace('{{TABLE_ROWS}}', tableRowsHtml)
    .replace('{{ALLERGY_REACTION_TITLE}}', t('checklist.allergyReactionTitle'))
    .replace('{{ALLERGY_WARNING}}', t('checklist.allergyWarning'))
    .replace('{{MEDICAL_SOURCES_TITLE}}', t('checklist.medicalSourcesTitle'))
    .replace('{{DISCLAIMER_TITLE}}', t('checklist.disclaimerTitle'))
    .replace('{{DISCLAIMER}}', t('checklist.disclaimer'))
    .replace('{{SIGNATURE}}', t('checklist.signature'));
}
