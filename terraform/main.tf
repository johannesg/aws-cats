# Configure the Azure provider
terraform {
  backend "azurerm" {
    container_name = "tfstate"
    key = "terraform.tfstate"
    storage_account_name = "tfstate5430"
    resource_group_name = "tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.65"
    }
  }

  required_version = ">= 1.0.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "TerraformTestRG"
  location = "northeurope"
}

resource "azurerm_static_site" "cats" {
  name                = "cats"
  location            = "westeurope"
  resource_group_name = azurerm_resource_group.rg.name
  sku_size            = "Free"
  sku_tier            = "Free"
}
