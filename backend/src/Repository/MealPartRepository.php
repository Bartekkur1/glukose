<?php

namespace App\Repository;

use App\Entity\MealPart;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method MealPart|null find($id, $lockMode = null, $lockVersion = null)
 * @method MealPart|null findOneBy(array $criteria, array $orderBy = null)
 * @method MealPart[]    findAll()
 * @method MealPart[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MealPartRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, MealPart::class);
    }

    // /**
    //  * @return MealPart[] Returns an array of MealPart objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?MealPart
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
