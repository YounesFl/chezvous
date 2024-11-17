import { test, expect, request, APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import { APIClient } from '../utils/apiClient';

dotenv.config();

test('Should get account details', async ({ playwright }) => {
  const apiRequestContext = await playwright.request.newContext();
  const apiClient = new APIClient(apiRequestContext);

  const token = await apiClient.getAccessToken();
  expect(token).toBeDefined();

  const accountData = await apiClient.getAccountDetails(token);

  expect(accountData.email).toBe(process.env.USERNAME);
  expect(accountData.firstName).toBe('Younes');
  expect(accountData.lastName).toBe('Zeroil');
  expect(accountData.userName).toBe('younes ze');

  // Vérifier les informations d'adresse de l'utilisateur
  expect(accountData.address.id).toBe(601306);
  expect(accountData.address.road).toBe("217 Rue de l'Ambassadeur");
  expect(accountData.address.zipCode).toBe("78700");
  expect(accountData.address.locality).toBe("Conflans-Sainte-Honorine");

  // Vérifier les informations sur le pays dans l'adresse
  expect(accountData.address.country.id).toBe(75);
  expect(accountData.address.country.name).toBe("France");
  expect(accountData.address.country.code2d).toBe("FR");
  expect(accountData.address.country.code3d).toBe("FRA");
});
