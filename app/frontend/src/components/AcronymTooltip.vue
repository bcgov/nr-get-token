<template>
  <v-tooltip right>
    <template #activator="{ on }">
      <v-icon v-on="on">help_outline</v-icon>
    </template>
    The Application Acronym must comply with the following format:
    <ul>
      <li>UPPERCASE LETTERS ONLY</li>
      <li>Underscores may be placed between letters</li>
      <li>Must begin and end with a letter</li>
      <li>
        Between {{ fieldValidations.ACRONYM_MIN_LENGTH }} and
        {{ fieldValidations.ACRONYM_MAX_LENGTH }} characters
      </li>
      <li>
        Examples:
        <em>ABCD</em>,
        <em>ABCD_WXYZ</em>
      </li>
    </ul>
  </v-tooltip>
</template>

<script>
import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'AcronymTooltip',
  computed: {
    fieldValidations: () => FieldValidations,
  },
};
</script>
