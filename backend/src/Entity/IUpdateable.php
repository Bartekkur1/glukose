<?php

namespace App\Entity;

Interface IUpdateable
{
    public function updateFromInput($input);
}